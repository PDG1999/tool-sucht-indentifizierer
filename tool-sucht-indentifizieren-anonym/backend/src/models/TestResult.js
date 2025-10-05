const { pool } = require('../config/database');

class TestResult {
  static async create(testData) {
    const {
      clientId,
      counselorId,
      responses,
      publicScores,
      professionalScores,
      sessionNotes,
      followUpRequired,
      followUpDate,
      riskLevel,
      primaryConcern
    } = testData;

    const query = `
      INSERT INTO test_results (
        client_id, counselor_id, responses, public_scores, professional_scores,
        session_notes, follow_up_required, follow_up_date, risk_level, primary_concern
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      clientId, counselorId, JSON.stringify(responses), JSON.stringify(publicScores),
      JSON.stringify(professionalScores), sessionNotes, followUpRequired, followUpDate,
      riskLevel, primaryConcern
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByClientId(clientId) {
    const query = `
      SELECT tr.*, c.name as client_name
      FROM test_results tr
      JOIN clients c ON tr.client_id = c.id
      WHERE tr.client_id = $1
      ORDER BY tr.completed_at DESC
    `;
    const result = await pool.query(query, [clientId]);
    return result.rows;
  }

  static async findByCounselorId(counselorId, options = {}) {
    const { riskLevel, concern, limit = 50, offset = 0 } = options;
    let query = `
      SELECT tr.*, c.name as client_name, c.email as client_email
      FROM test_results tr
      JOIN clients c ON tr.client_id = c.id
      WHERE tr.counselor_id = $1
    `;
    const values = [counselorId];
    let paramCount = 1;

    if (riskLevel) {
      paramCount++;
      query += ` AND tr.risk_level = $${paramCount}`;
      values.push(riskLevel);
    }

    if (concern) {
      paramCount++;
      query += ` AND tr.primary_concern ILIKE $${paramCount}`;
      values.push(`%${concern}%`);
    }

    query += ` ORDER BY tr.completed_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT tr.*, c.name as client_name, c.email as client_email
      FROM test_results tr
      JOIN clients c ON tr.client_id = c.id
      WHERE tr.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, updateData) {
    const { sessionNotes, followUpRequired, followUpDate } = updateData;
    const query = `
      UPDATE test_results 
      SET session_notes = COALESCE($2, session_notes),
          follow_up_required = COALESCE($3, follow_up_required),
          follow_up_date = COALESCE($4, follow_up_date),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const values = [id, sessionNotes, followUpRequired, followUpDate];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getStats(counselorId, timeRange = '30 days') {
    const query = `
      SELECT 
        COUNT(*) as total_tests,
        COUNT(CASE WHEN completed_at > NOW() - INTERVAL '${timeRange}' THEN 1 END) as recent_tests,
        COUNT(CASE WHEN risk_level = 'critical' THEN 1 END) as critical_tests,
        COUNT(CASE WHEN risk_level = 'high' THEN 1 END) as high_tests,
        COUNT(CASE WHEN risk_level = 'moderate' THEN 1 END) as moderate_tests,
        COUNT(CASE WHEN risk_level = 'low' THEN 1 END) as low_tests,
        AVG((professional_scores->>'overall')::int) as avg_risk_score,
        COUNT(CASE WHEN follow_up_required = true THEN 1 END) as follow_up_required
      FROM test_results 
      WHERE counselor_id = $1
    `;
    const result = await pool.query(query, [counselorId]);
    return result.rows[0];
  }

  static async getAnalytics(counselorId, timeRange = '6 months') {
    const query = `
      SELECT 
        DATE_TRUNC('month', completed_at) as month,
        COUNT(*) as test_count,
        AVG((professional_scores->>'overall')::int) as avg_risk_score
      FROM test_results 
      WHERE counselor_id = $1 
        AND completed_at > NOW() - INTERVAL '${timeRange}'
      GROUP BY DATE_TRUNC('month', completed_at)
      ORDER BY month DESC
    `;
    const result = await pool.query(query, [counselorId]);
    return result.rows;
  }

  static async getConcernStats(counselorId) {
    const query = `
      SELECT 
        primary_concern,
        COUNT(*) as count,
        AVG((professional_scores->>'overall')::int) as avg_risk_score
      FROM test_results 
      WHERE counselor_id = $1
      GROUP BY primary_concern
      ORDER BY count DESC
    `;
    const result = await pool.query(query, [counselorId]);
    return result.rows;
  }
}

module.exports = TestResult;
