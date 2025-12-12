import { Icon, Medal } from "lucide-react"



export default function CompetencyPage() {
    return (
        <>
            <div>
                <div>
                    <h1>Competency Page</h1>
                    <p>Track and assess your skills and knowledge here.</p>
                </div>
                <div>
                    <div>
                        <div className="">
                            <div className="">
                                <h1>Overall Competency</h1>
                                <Medal />
                            </div>
                            <div className=""></div>
                            <p></p>
                            <div
                                className="bg-indigo-600 h-2 rounded-full transition-all"
                            />
                        </div>
                    </div>
                    <div className="">
                        <div className="">
                            <div className="">
                                <h1>Competent Skills</h1>
                                <Medal />
                            </div>
                            <div className=""></div>
                            <p></p>
                            <p>Skills Assessed</p>
                        </div>
                    </div>
                    <div className="">
                        <div className="">
                            <div className="">
                                <h1>Needs Development</h1>
                                <Medal />
                            </div>
                            <div className=""></div>
                            <p></p>
                            <p>Skills to improve</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}