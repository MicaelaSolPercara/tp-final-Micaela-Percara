import pool from "./mysql";

(async () => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("✅ Conexión OK:", rows);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error conectando a MySQL:", error);
    process.exit(1);
  }
})();
