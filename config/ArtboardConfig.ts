// Check if the measurement type is a click task
export const isClickTask = (measurementType: string) => {
    return ["click", "topLeftCalibration", "bottomRightCalibration", "cursorMovement"].includes(measurementType);
}

// Check if the measurement type is a cursor movement task
export const isCursorMovementTask = (measurementType: string) => {
    return measurementType === 'cursorMovement';
}

// Check if the measurement type is a calibration task
export const isCalibrationTask = (measurementType: string) => {
    return ["topLeftCalibration", "bottomRightCalibration"].includes(measurementType);
}

export interface ArtboardDimensions {
    width: number;
    height: number;
}

// Define the type for the artboard task configuration
export interface ArtboardTaskConfig {
    measurementType: 
        'click' | 
        'cursorMovement' | 
        'topLeftCalibration' | 
        'bottomRightCalibration' | 
        'none' | 
        'taskComplete',
    artboardTitle: string,
    initialMessage: string,
    confirmationMessage?: string,
    isStudyTask: boolean,
}

export type StudySetup = ArtboardTaskConfig[];