const db = require("../config/db");

exports.getRiwayat = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT 
        r.id, 
        b.nama_barang, 
        r.perubahan, 
        r.stok_sebelumnya, 
        r.stok_baru, 
        r.satuan, 
        r.created_at, 
        r.jumlah 
      FROM riwayat r 
      JOIN barang b ON r.barang_id = b.id 
      ORDER BY r.created_at DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("Error getRiwayat:", err);
    res.status(500).json({ error: err.message });
  }
};
