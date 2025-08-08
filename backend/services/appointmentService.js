const getAppointments = async (req, res) => {
  res.send('GET test');
};

const createAppointment = async (req, res) => {
  res.send('POST test');
};

const updateAppointment = async (req, res) => {
  res.send('UPDATE test');
};

const deleteAppointment = async (req, res) => {
  res.send('DELETE test');
};

export { getAppointments, createAppointment, updateAppointment, deleteAppointment };