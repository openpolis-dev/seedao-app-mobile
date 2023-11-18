import Layout from "../components/layout/layout";
import NewCalendar from "../components/calendar/newCalendar";
import {useTranslation} from "react-i18next";

export default function Calendar(){

    const { t } = useTranslation();

    return  <Layout title={t("Calendar.Calendar")} headBgColor={`var(--background-color)`}>
        {/*<CalendarBox />*/}
        <NewCalendar />
    </Layout>
}

