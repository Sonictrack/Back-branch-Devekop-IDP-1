import { userTypeChoice } from "./utils";
import { UserType } from "../components/enums/userType";

export function getAllPositions(type: UserType): Promise<Response> {
  let url = userTypeChoice(type, "positions");
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: "POST", body, credentials: "include" });
}

export function recordPosition(type: UserType, position: Object): Promise<Response> {
  const urlText = "position";
  let url = userTypeChoice(type, urlText);
  const body = new FormData();
  body.append("position", JSON.stringify(position));
  body.append('type', type)
  return fetch(url, { method: "POST", body, credentials: "include" });
}
