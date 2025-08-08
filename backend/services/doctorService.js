const getDoctors = async (req, res) => {
  res.send('GET test');
};

const createDoctor = async (req, res) => {
  res.send('POST test');
};

const updateDoctor = async (req, res) => {
  res.send('UPDATE test');
};

const deleteDoctor = async (req, res) => {
  res.send('DELETE test');
};

export { getDoctors, createDoctor, updateDoctor, deleteDoctor };