
enum EventType {
    MOUSE_MOVE = "MOUSE_MOVE",
    MOUSE_CLICK = "MOUSE_CLICK",
    NAVIGATE = "NAVIGATE",
}

interface SubmitDataProps {
    nodeId: string;
    artboardName: string;
    event: EventType;
}

interface ClickData extends SubmitDataProps {
    onHotZone: boolean;
    x: number;
    y: number;
}


export const useSubmitData = () => {
    const submitData = (data: any) => {
        console.log(data);
    };

    return { submitData };
};