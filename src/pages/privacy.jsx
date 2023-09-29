import Layout from "../components/layout/layout";
import {useTranslation} from "react-i18next";
import AppConfig from "../AppConfig";
export default function Privacy(){
    const {t,i18n} = useTranslation();

    const privacyUrl = AppConfig.privacy;


    return <Layout noTab title={t('mobile.my.privacy')}>
        <iframe src={privacyUrl} frameBorder="0" width="100%" height="100%"></iframe>
    </Layout>
}
