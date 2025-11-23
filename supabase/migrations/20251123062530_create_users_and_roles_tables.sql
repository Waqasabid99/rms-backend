/*
  # Create Users and Roles Tables for Restaurant Management System

  1. New Tables
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique) - role name (admin, staff)
      - `description` (text) - role description
      - `created_at` (timestamptz)
      
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `password_hash` (text, not null)
      - `full_name` (text, not null)
      - `role_id` (uuid, foreign key to roles)
      - `phone` (text)
      - `is_active` (boolean, default true)
      - `last_login` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read their own data
    - Add policies for admin users to manage all users
    - Add policies for role management

  3. Initial Data
    - Insert default roles (admin, staff)
    - Create default admin user
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role_id uuid REFERENCES roles(id) ON DELETE SET NULL,
  phone text,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Enable Row Level Security
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for roles table
-- Allow all authenticated users to read roles
CREATE POLICY "Authenticated users can view roles"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can insert roles
CREATE POLICY "Service role can insert roles"
  ON roles FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Only service role can update roles
CREATE POLICY "Service role can update roles"
  ON roles FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Only service role can delete roles
CREATE POLICY "Service role can delete roles"
  ON roles FOR DELETE
  TO service_role
  USING (true);

-- RLS Policies for users table
-- Users can view their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Admin users can view all users
CREATE POLICY "Admin users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.name = 'admin'
    )
  );

-- Users can update their own profile (except role_id)
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role_id = (SELECT role_id FROM users WHERE id = auth.uid()));

-- Admin users can insert new users
CREATE POLICY "Admin users can create users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.name = 'admin'
    )
  );

-- Admin users can update any user
CREATE POLICY "Admin users can update all users"
  ON users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.name = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.name = 'admin'
    )
  );

-- Admin users can delete users
CREATE POLICY "Admin users can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.name = 'admin'
    )
  );

-- Insert default roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'Administrator with full system access'),
  ('staff', 'Staff member with limited access to orders only')
ON CONFLICT (name) DO NOTHING;

-- Insert default admin user (password: Admin@123)
-- Note: In production, this should be changed immediately
INSERT INTO users (email, password_hash, full_name, role_id, phone)
SELECT 
  'admin@restaurant.com',
  '$2a$10$8K1p/a0dL0LLQjH5bYFYMOSMfJXVYwS0lMFPsVvJqZVQZFVxLKL5C',
  'System Administrator',
  (SELECT id FROM roles WHERE name = 'admin'),
  '+1234567890'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@restaurant.com');

-- Insert default staff user (password: Staff@123)
INSERT INTO users (email, password_hash, full_name, role_id, phone)
SELECT 
  'staff@restaurant.com',
  '$2a$10$QGQcWnFvO5CGMpEJCW.bVOLPt9LQp7pN0YmRqWJqYvGHGQqvKmG4.',
  'Staff Member',
  (SELECT id FROM roles WHERE name = 'staff'),
  '+1234567891'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'staff@restaurant.com');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
