import {useContext, useState} from "react";
import {
    InsertKeyResultType,
    KeyResultModalType,
} from "../types/OKRTypes";
import Input from "./Input";
import {CircleX, PackagePlus} from "lucide-react";
import {OkrContext} from "../context/OkrProvider";
import {addKeyResultToObjective} from "../database/OKRStore.ts";

const defaultKeyResults: InsertKeyResultType = {
    title: "",
    initialValue: 0,
    currentValue: 0,
    targetValue: 0,
    metric: "",
};

export default function AddKeyResultModal({
                                              closeModal,
                                              keyResultModal,
                                          }: {
    closeModal: () => void;
    keyResultModal: KeyResultModalType;
}) {
    const {objectives, setObjectives} = useContext(OkrContext)

    const [keyResult, setKeyResult] = useState<InsertKeyResultType>(defaultKeyResults);

    function handleAddKeyResult() {
        if (objectives === null) return;

        if(keyResult.title === "" || keyResult.metric === "") { alert("Please enter a field!"); return; }

        console.log(keyResult);

        const foundObj = objectives.find(
            (_, idx) => keyResultModal.objectiveIndex === idx
        );

        if (foundObj === undefined) return;
        addKeyResultToObjective([keyResult], foundObj.id).then((data) => {
            foundObj.keyResults.push({...keyResult, id: data[0].id, objectiveId: data[0].objectiveId});

            const updatedObjectives = objectives.map((objective, idx) => {
                return idx === keyResultModal.objectiveIndex ? foundObj : objective;
            });
            setObjectives(updatedObjectives);
        }).catch((error) => {
            alert(error);
        })
        closeModal();
    }

    function handleChange(key: string, value: number | string) {
        const updatedKeyResult: InsertKeyResultType = {...keyResult, [key]: value};
        setKeyResult(updatedKeyResult);
    }

    return (
        <div className="inset-0 fixed bg-gray-500 flex bg-opacity-50 justify-center items-center z-20">
            <div
                id="firstKeyResult"
                className="bg-white relative border-3 rounded-md p-10 w-1/2 flex flex-col space-y-2"
            >
                <div className="w-full flex justify-between mb-3">
                    <h1 className="text-secondary font-medium mb-2">{objectives != null && objectives[keyResultModal.objectiveIndex].objective}</h1>
                    <button
                        onClick={closeModal}
                        className="text-red-500"
                    >
                        <CircleX className="w-5 h-5"/>
                    </button>
                </div>
                <Input
                    label={"Title"}
                    value={keyResult.title}
                    className="flex-grow"
                    type="text"
                    placeholder="Key Result Title 1"
                    onChange={(e) => {
                        handleChange("title", e.target.value);
                    }}
                />
                <div
                    id="firstKeyResultMetrics"
                    className="flex justify-between flex-wrap gap-2"
                >
                    <Input
                        label={"Initial Value"}
                        value={keyResult.initialValue}
                        type="number"
                        placeholder="Initial Value"
                        onChange={(e) => {
                            handleChange("initialValue", parseInt(e.target.value));
                        }}
                    />
                    <Input
                        label={"Current Value"}
                        value={keyResult.currentValue}
                        type="number"
                        placeholder="Current Value"
                        onChange={(e) => {
                            handleChange("currentValue", parseInt(e.target.value));
                        }}
                    />
                    <Input
                        label={"Target Value"}
                        value={keyResult.targetValue}
                        type="number"
                        placeholder="Target Value"
                        onChange={(e) => {
                            handleChange("targetValue", parseInt(e.target.value));
                        }}
                    />
                    <Input
                        label={"Metric"}
                        value={keyResult.metric}
                        type="text"
                        placeholder="Metrics Value"
                        onChange={(e) => {
                            handleChange("metric", e.target.value);
                        }}
                    />
                    <div className="flex h-full gap-x-5">
                    <button
                        onClick={() => handleAddKeyResult()}
                        className="hover:bg-white h-full border hover:border-[#12a6a7] bg-primary text-white hover:text-[#12a6a7] p-3 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-x-1.5 ease-in-out"
                    >
                        <PackagePlus className="w-4 h-4" />
                        Add Key Result
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
