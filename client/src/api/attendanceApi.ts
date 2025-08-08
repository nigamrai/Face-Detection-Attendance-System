import axiosInstance from "../helpers/axiosInstance";

export interface Attendance {
  sn: number;
  checkIn?: string | null;
  checkOut?: string | null;
  status: string;
}

export const fetchAttendanceByUser = async (userId: string): Promise<Attendance[]> => {
  const res = await axiosInstance.get(`/api/v1/attendance/${userId}`);
  return res.data.records;
};

export const addAttendance = async (data: { date: string; status: string }): Promise<Attendance> => {
  const res = await axiosInstance.post("/api/v1/attendance", data);
  return res.data;
};