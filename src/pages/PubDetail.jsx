import React from 'react';
import {  useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from "components/layout/layout";
import PubInner from "../components/pub/PubInner";


export default function PubDetail() {
    // const { dispatch } = useAuthContext();
    // const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();



    return (
        <Layout title={t("Pub.DetailTitle")}>
            <PubInner id={id} />
        </Layout>
    );
}
