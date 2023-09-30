import ProjectProvider from "../provider";
import ProjectInfo from "./info";

export default function ProjectInfoRoot() {
  return (
    <ProjectProvider>
      <ProjectInfo />
    </ProjectProvider>
  );
}
