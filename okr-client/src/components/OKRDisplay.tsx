import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {KeyResultModalType, ObjectiveType} from "../types/OKRTypes";
import MetricsLabel from "./MetricLabel";
import {CircleCheck, FilePenLine, Goal, LoaderCircle, Package, SquarePlus, Trash2} from "lucide-react";
import AddKeyResultModal from "./AddKeyResultModal";
import {OkrContext} from "../context/OkrProvider";
import {deleteKeyResultOfObjective, deleteOkrsDataFromDB, getOkrsData} from "../database/OKRStore.ts";
import NoGoalImage from "../assets/NoGoal.svg"

export default function OKRDisplay({
                                       objectiveForUpdate,
                                       setObjectiveForUpdate
                                   }: {
    objectiveForUpdate: ObjectiveType;
    setObjectiveForUpdate: React.Dispatch<React.SetStateAction<ObjectiveType>>
}) {
    const {objectives, setObjectives, isWaitingForResponse} = useContext(OkrContext)

    const [keyResultModal, setKeyResultModal] = useState<KeyResultModalType>({
        isOpen: false,
        objectiveIndex: -1,
    });

    useEffect(() => {
        if (!keyResultModal.isOpen) {
            console.log("keyResultModal is opened");
            (async () => {
                const objectivesResponse = await getOkrsData();
                setObjectives(objectivesResponse);
            })();
        }
    }, [keyResultModal.isOpen])

    function deleteKeyResult(objectiveIdx: number, keyResultIdx: number, keyResultDBId: string) {
        if (objectives === null) return;
        deleteKeyResultOfObjective(keyResultDBId).then(() => {
            const foundObj = objectives.find((_, idx) => objectiveIdx === idx);

            if (foundObj === undefined) return;
            foundObj.keyResults = foundObj?.keyResults.filter(
                (_, krIdx) => krIdx !== keyResultIdx
            );

            const updatedObjectives = objectives.map((objective, idx) => {
                return idx === objectiveIdx ? foundObj : objective;
            });

            setObjectives(updatedObjectives);
        }).catch((error) => {
            console.log(error)
        })
    }

    async function deleteObjective(objectiveIdx: string, index: number) {
        if (objectives === null) return;

        try {
            await deleteOkrsDataFromDB(objectiveIdx);
        } catch (error) {
            alert(error);
        }
        const updatedObjectives = objectives.filter((_, idx) => index !== idx);
        setObjectives(updatedObjectives);
    }


    function getProgress(init:number, target: number, current: number): [number, number, number, number] {
        const progress: [number, number, number, number] = [0, 33, 66, 80];

        if (target !== 0) {
            progress[0] = (current - init)  / (target - init) * 100; // percentage
            progress[1] = (target * 0.33) / target * 100; // low
            progress[2] = (target * 0.66) / target * 100 // high
            progress[3] = (target * 0.80) / target * 100 // optimum
        }

        return progress;
    }

    return (
        <div
            id="showObjectives"
            className="w-1/2 h-[90%] rounded-md p-10 bg-white border-1 shadow overflow-y-scroll flex flex-wrap justify-between gap-14"
        >
            {objectives != null && objectives.length > 0 ? (
                objectives.map((objective, objectiveIdx) => {
                    return (
                        <div
                            key={objectiveIdx}
                            className="relative w-72 h-max border border-gray-200 rounded-md p-5 shadow group"
                        >
                            {objective.id === objectiveForUpdate.id && isWaitingForResponse ?
                                (<div
                                    className="w-full h-full absolute top-0 left-0 flex items-center justify-center bg-white z-10 bg-opacity-80 border-gray-200">
                                    <LoaderCircle className="w-10 h-10 mr-1 animate-spin"/>
                                </div>)
                                : ""}
                            <div className="flex items-center justify-between mb-3">
                                <h1 className="font-bold text-center text-base w-full truncate mb-2">
                                    {objective.objective}
                                </h1>
                                <div
                                    className="items-center gap-x-3 z-10 -mt-2 hidden group-hover:flex absolute -top-3 bg-white p-2 shadow px-5 border rounded-full left-1/2 -translate-x-1/2">
                                    <button
                                        onClick={() => deleteObjective(objective.id, objectiveIdx)}
                                        className="text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </button>
                                    <button onClick={() => {
                                        setObjectiveForUpdate({...objective})
                                    }}>
                                        <FilePenLine className="w-4 h-4 text-primary"/>
                                    </button>
                                </div>
                            </div>

                            {objective.keyResults && objective.keyResults.length > 0 ? (
                                objective.keyResults.map((keyResult, index) => (
                                    <div key={index}
                                         className={`relative pt-2 p-3 ${keyResult.currentValue >= keyResult.targetValue && index == 0 ? "mt-4" : (keyResult.currentValue >= keyResult.targetValue) ? "mt-8" : "mt-3"} bg-gray-100 rounded-md shadow`}>
                                        {
                                            keyResult.currentValue >= keyResult.targetValue &&
                                            <p className="absolute -top-3 left-5 flex items-center gap-x-1 text-xs bg-gray-600 font-medium text-white rounded-full px-2 py-1">
                                                <CircleCheck className="w-3.5 h-3.5"/> Done</p>
                                        }
                                        <button
                                            onClick={() => deleteKeyResult(objectiveIdx, index, keyResult.id)}
                                            className="border bg-red-500 text-white hover:text-red-500 hover:bg-white hover:border-red-500 absolute top-1/2 -translate-y-1/2 -right-10 shadow-lg hover:shadow-inner rounded-full p-2"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                        <div
                                            className={`mb-3 bg-white ${keyResult.currentValue >= keyResult.targetValue ? "mt-3" : "mt-1"} rounded-md flex items-center justify-between shadow-sm`}>
                                            <Goal className="w-4 h-4 text-gray-700 ml-3 "/>
                                            <p className={`text-primary text-xs w-full p-2 font-medium rounded-md`}>
                                                {keyResult.title}</p>
                                        </div>
                                        <MetricsLabel label={"Metric"} value={keyResult.metric}/>
                                        <div className="w-full flex items-center justify-between mt-3">
                                            <StatisticsCard
                                                label={"Initial"}
                                                value={keyResult.initialValue}
                                            />
                                            <StatisticsCard
                                                label={"Current"}
                                                value={keyResult.currentValue}
                                            />
                                            <StatisticsCard
                                                label={"Target"}
                                                value={keyResult.targetValue}
                                            />
                                        </div>
                                        <meter
                                            className="w-full rounded-full mt-2"
                                            id="stress"
                                            min={0}
                                            max={100}
                                            optimum={getProgress(keyResult.initialValue, keyResult.targetValue, keyResult.currentValue)[3]}
                                            low={getProgress(keyResult.initialValue, keyResult.targetValue, keyResult.currentValue)[1]}
                                            high={getProgress(keyResult.initialValue, keyResult.targetValue, keyResult.currentValue)[2]}
                                            value={getProgress(keyResult.initialValue, keyResult.targetValue, keyResult.currentValue)[0]}></meter>
                                        <div className="flex w-full font-medium items-center justify-between">
                                            <p className="text-xs">{keyResult.currentValue} of <span
                                                className="text-gray-500">{keyResult.targetValue} (Progress)</span>
                                            </p>
                                            <p className="text-xs text-primary">{getProgress(keyResult.initialValue, keyResult.targetValue, keyResult.currentValue)[0].toFixed(2)} %</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm font-medium text-gray-600 my-5 flex flex-col items-center justify-center">
                                    <Package className="w-5 h-5 mr-1"/>No Key-Results Defined.</p>
                            )}

                            <button
                                onClick={() =>
                                    setKeyResultModal({
                                        isOpen: true,
                                        objectiveIndex: objectiveIdx,
                                    })
                                }
                                className="absolute -bottom-5 left-1/2 -translate-x-1/2 p-2 rounded-full border border-secondary hover:bg-white bg-secondary hover:text-[#91b30f] text-white shadow-md"
                            >
                                <SquarePlus className="w-4 h-4"/>
                            </button>
                        </div>
                    );
                })
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <img src={NoGoalImage} alt="No Goal" width={300}/>
                    <p className="mt-6 font-medium text-gray-700">
                        Ready to <span className="text-primary">level up?</span> Set your first goal.
                    </p>
                </div>
            )}
            {
                keyResultModal.isOpen && (
                    <AddKeyResultModal
                        keyResultModal={keyResultModal}
                        closeModal={() =>
                            setKeyResultModal({isOpen: false, objectiveIndex: -1})
                        }
                    />
                )
            }
        </div>
    )
        ;
}


const StatisticsCard = ({label, value}: { label: string, value: number | string }) => {
    return (
        <div className="flex flex-col bg-white shadow-sm w-[60px] items-center justify-center text-xs font-medium p-2 rounded-md">
            <p className="text-secondary mb-1">{label}</p>
            <p>{value}</p>
        </div>
    )
}