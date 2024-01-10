import BaseModal from "./baseModal";
import { useTranslation } from "react-i18next";

export default function LoginMetaforoModal({ onClose, onConfirm }) {
  const { t } = useTranslation();
  return <BaseModal msg={t("Proposal.LoginTip")} onCancel={onClose} onConfirm={onConfirm}></BaseModal>;
}
