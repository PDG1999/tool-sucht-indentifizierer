const { pool } = require('../config/database');

class Client {
  static async create(clientData) {
    const { counselorId, name, email, phone, notes } = clientData;
    const query = `
      INSERT INTO clients (counselor_id, name, email, phone, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [counselorId, name, email, phone, notes];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByCounselorId(counselorId, options = {}) {
    const { status, search, limit = 50, offset = 0 } = options;
    let query = 'SELECT * FROM clients WHERE counselor_id = $1';
    const values = [counselorId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      values.push(status);
    }

    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      values.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM clients WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, updateData) {
    const { name, email, phone, status, notes } = updateData;
    const query = `
      UPDATE clients 
      SET name = COALESCE($2, name),
          email = COALESCE($3, email),
          phone = COALESCE($4, phone),
          status = COALESCE($5, status),
          notes = COALESCE($6, notes),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const values = [id, name, email, phone, status, notes];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM clients WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getStats(counselorId) {
    const query = `
      SELECT 
        COUNT(*) as total_clients,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_clients,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_clients,
        COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived_clients,
        COUNT(CASE WHEN last_test_at > NOW() - INTERVAL '30 days' THEN 1 END) as recent_tests
      FROM clients 
      WHERE counselor_id = $1
    `;
    const result = await pool.query(query, [counselorId]);
    return result.rows[0];
  }
}

module.exports = Client;
