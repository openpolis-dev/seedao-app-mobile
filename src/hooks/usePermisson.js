import { useState, useEffect } from "react";

const askPermission = () => {
  return new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function (permissionResult) {
    if (permissionResult !== "granted") {
      throw new Error("We weren't granted permission.");
    }
  });
};


export default function usePermisson() {
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    if (!window.Notification) {
      console.error("not support navigator");
      return;
    }

    const handlePermission = (permission) => {
      setPermission(permission);
    };

    Notification.requestPermission()
      .then(handlePermission)
      .catch((err) => console.error("permission failed", err));
  }, []);

  const handlePermission = () => {
    return askPermission()
      .then((res) => {
        console.log("you agreed permission");
        setPermission("granted");
      })
      .catch((err) => {
        console.error("you denied permission");
      });
  };

  

  return { handlePermission, permission };
}