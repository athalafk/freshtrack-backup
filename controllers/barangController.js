const db = require("../config/db");

exports.getBarang = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT 
         b.id, 
         b.nama_barang, 
         b.satuan,
         COALESCE(SUM(bg.stok), 0) AS total_stok
       FROM barang b
       LEFT JOIN batch_barang bg ON b.id = bg.barang_id
       GROUP BY b.id
       ORDER BY b.nama_barang ASC`
    );

    // Convert id dan total_stok ke tipe Number
    const parsedResults = rows.map((item) => ({
      ...item,
      id: Number(item.id),
      total_stok: Number(item.total_stok),
    }));

    res.json(parsedResults);
  } catch (err) {
    console.error("Error getBarang:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getBatchBarang = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT 
        bg.id,
        bg.barang_id,
        b.nama_barang,
        bg.stok,
        b.satuan,
        bg.tanggal_kadaluarsa AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta' AS tanggal_kadaluarsa,
        DATE_PART('day', bg.tanggal_kadaluarsa - NOW()) AS hari_menuju_kadaluarsa
      FROM batch_barang bg
      JOIN barang b ON bg.barang_id = b.id
      ORDER BY bg.tanggal_kadaluarsa ASC`
    );

    // Format tanggal_kadaluarsa ke ISO string
    const formattedResults = rows.map(item => ({
      ...item,
      tanggal_kadaluarsa: new Date(item.tanggal_kadaluarsa).toISOString(),
      hari_menuju_kadaluarsa: Number(item.hari_menuju_kadaluarsa),
    }));

    console.log("Data batch:", formattedResults);
    res.json(formattedResults);
  } catch (err) {
    console.error("Error getBatchBarang:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateBarang = async (req, res) => {
  const { id } = req.params;
  const { nama_barang, satuan } = req.body;

  console.log("Update Barang:", id, nama_barang, satuan); // Debugging

  if (!nama_barang || !satuan) {
    return res
      .status(400)
      .json({ error: "Nama barang dan satuan wajib diisi." });
  }

  try {
    const result = await db.query(
      "UPDATE barang SET nama_barang = $1, satuan = $2 WHERE id = $3 RETURNING *",
      [nama_barang, satuan, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Barang tidak ditemukan." });
    }

    res.json({ message: "Barang berhasil diperbarui.", data: result.rows[0] });
  } catch (err) {
    console.error("Error updateBarang:", err);
    res.status(500).json({ error: err.message });
  }
};
