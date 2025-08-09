const databaseConfig = async (DB_POOL) => {
    
    const getAllData = async (table) => {
        try {
            if (!table) {
                return;
            }
            const res = await DB_POOL.query(`SELECT * FROM ${table}`);
            return res.rows;
        } catch (error) {
            console.error('Error al ejecutar la consulta', error);
        }
    };

    return { getAllData }
};

export default databaseConfig;
