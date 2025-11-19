
import { apiBase } from "../../utils/configs/api-config";

export async function getBlog(id) {
  const res = await fetch(`${apiBase}/blogs/${id}`);
  return res.json();
}
