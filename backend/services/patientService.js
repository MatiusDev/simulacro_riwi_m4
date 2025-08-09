const getPatients = async (req, res) => {
  res.json({ message: "GET test" });
};

const createPatient = async (req, res) => {
  res.send('POST test');
};

const updatePatient = async (req, res) => {
  res.send('UPDATE test');
};

const deletePatient = async (req, res) => {
  res.send('DELETE test');
};

export { getPatients, createPatient, updatePatient, deletePatient };