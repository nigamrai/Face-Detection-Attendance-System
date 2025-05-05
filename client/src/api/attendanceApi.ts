import axiosInstance from "../helpers/axiosInstance";

export interface Attendance {
  id?: string;
  date: string;
  status: string;
}

export const fetchAttendance = async (): Promise<Attendance[]> => {
  const res = await axiosInstance.get("/attendance");
  return res.data;
};

export const addAttendance = async (data: { date: string; status: string }): Promise<Attendance> => {
  const res = await axiosInstance.post("/attendance", data);
  return res.data;
};