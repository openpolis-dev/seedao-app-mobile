import { useState, useEffect } from "react";
import runOneSignal from "utils/onesignal";

const checkNotificationSupport = () => {
  if (!window.Notification) {
    logError("not support navigator");
    return;
  }
  return true;
};

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

export default function usePushPermission() {
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    if (!checkNotificationSupport()) {
      return;
    }

    const handlePermission = (permission) => {
      setPermission(permission);
    };

    Notification.requestPermission()
      .then(handlePermission)
      .catch((err) => logError("permission failed", err));
  }, []);

  const handlePermission = (callback) => {
    if (permission === "granted") {
      runOneSignal();
      callback && callback();
    }
    if (!checkNotificationSupport()) {
      callback && callback();
      return Promise.reject("not support navigator");
    }
    return askPermission()
      .then((res) => {
        console.log("you agreed permission");
        setPermission("granted");
        runOneSignal();
      })
      .catch((err) => {
        logError("you denied permission");
      })
      .finally(() => {
        callback && callback();
      });
  };

  return handlePermission;
}
