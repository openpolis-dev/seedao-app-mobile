import { useSearchParams, useNavigate } from "react-router-dom";
import { sendTransactionCallback } from "@joyid/evm";
import { useEffect } from "react";

export default function JoyIDRedirect() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  console.log(search);
  const action = search.get("action");

  const getLocalData = () => {
    const localsns = localStorage.getItem("sns") || "";
    let data;
    try {
      data = JSON.parse(localsns);
    } catch (error) {
      data = {};
    }
    return data;
  };

  const handleCommitData = (hash) => {
    const data = getLocalData();
    const account = localStorage.getItem("joyid-address");
    data[account] = {
      step: "commit",
      stepStatus: "pending",
      commitHash: hash,
      registerHash: "",
      secret: search.get("secret"),
      sns: search.get("sns"),
      timestamp: 0,
    };
    localStorage.setItem("sns", JSON.stringify(data));
  };

  const handleRegisterData = (hash) => {
    const data = getLocalData();
    const account = localStorage.getItem("joyid-address");
    data[account].step = "register";
    data[account].stepStatus = search.get("secret") !== "undefined" ? search.get("secret") : "pending";
    data[account].registerHash = hash;
    localStorage.setItem("sns", JSON.stringify(data));
  };

  useEffect(() => {
    console.log("===> joyid redirect action:", action);
    let res = "";
    try {
      res = sendTransactionCallback();
      console.log("===> joyid redirect res:", res);
      if (res && res.tx) {
        switch (action) {
          case "sns-commit":
            handleCommitData(res.tx);
            navigate("/sns/register");
            break;
          case "sns-register":
            handleRegisterData(res.tx);
            navigate("/sns/register", { state: true });
            break;
          case "sns-switch":
            navigate("/sns/user", { state: res.tx });
            break;
          default:
            break;
        }
        return;
      }
    } catch (error) {
      console.error(error);
    }
    if (!res) {
      switch (action) {
        case "sns-commit":
          navigate("/sns/register", { state: { sns: search.get("sns"), step: action } });
          break;
        case "sns-register":
          navigate("/sns/register");
          break;
        case "sns-switch":
          navigate("/sns/user");
          break;
        default:
          break;
      }
    }
  }, []);

  return <></>;
}
