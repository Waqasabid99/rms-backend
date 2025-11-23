const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase.config');

exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, is_active, sortBy = 'created_at', order = 'desc' } = req.query;

    let query = supabase
      .from('users')
      .select(`
        id,
        email,
        full_name,
        phone,
        is_active,
        last_login,
        created_at,
        roles (
          id,
          name,
          description
        )
      `);

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }

    query = query.order(sortBy, { ascending: order === 'asc' });

    const { data: users, error } = await query;

    if (error) {
      throw error;
    }

    let filteredUsers = users;

    if (role && role !== 'all') {
      filteredUsers = users.filter(user => user.roles?.name === role);
    }

    const formattedUsers = filteredUsers.map(user => ({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      is_active: user.is_active,
      last_login: user.last_login,
      created_at: user.created_at,
      role: user.roles?.name || 'staff',
      role_description: user.roles?.description || ''
    }));

    res.status(200).json({
      success: true,
      count: formattedUsers.length,
      data: formattedUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        full_name,
        phone,
        is_active,
        last_login,
        created_at,
        updated_at,
        roles (
          id,
          name,
          description
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        is_active: user.is_active,
        last_login: user.last_login,
        created_at: user.created_at,
        updated_at: user.updated_at,
        role: user.roles?.name || 'staff',
        role_id: user.roles?.id,
        role_description: user.roles?.description || ''
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, password, full_name, phone, role } = req.body;

    if (!email || !password || !full_name || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, full name, and role are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', role)
      .maybeSingle();

    if (roleError || !roleData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        full_name,
        phone: phone || null,
        role_id: roleData.id,
        is_active: true
      })
      .select(`
        id,
        email,
        full_name,
        phone,
        is_active,
        created_at,
        roles (
          id,
          name,
          description
        )
      `)
      .single();

    if (insertError) {
      throw insertError;
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        phone: newUser.phone,
        is_active: newUser.is_active,
        created_at: newUser.created_at,
        role: newUser.roles?.name || 'staff'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, full_name, phone, role, is_active } = req.body;

    const updates = {};

    if (email) updates.email = email.toLowerCase();
    if (full_name) updates.full_name = full_name;
    if (phone !== undefined) updates.phone = phone;
    if (is_active !== undefined) updates.is_active = is_active;

    if (role) {
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', role)
        .maybeSingle();

      if (roleError || !roleData) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role specified'
        });
      }

      updates.role_id = roleData.id;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data provided for update'
      });
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select(`
        id,
        email,
        full_name,
        phone,
        is_active,
        updated_at,
        roles (
          id,
          name,
          description
        )
      `)
      .maybeSingle();

    if (updateError) {
      throw updateError;
    }

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        full_name: updatedUser.full_name,
        phone: updatedUser.phone,
        is_active: updatedUser.is_active,
        updated_at: updatedUser.updated_at,
        role: updatedUser.roles?.name || 'staff'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const { data: roles, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching roles',
      error: error.message
    });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        id,
        is_active,
        roles (
          name
        )
      `);

    if (error) {
      throw error;
    }

    const stats = {
      total: users.length,
      active: users.filter(u => u.is_active).length,
      inactive: users.filter(u => !u.is_active).length,
      byRole: {}
    };

    users.forEach(user => {
      const roleName = user.roles?.name || 'staff';
      stats.byRole[roleName] = (stats.byRole[roleName] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
};
