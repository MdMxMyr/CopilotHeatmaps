interface ArtboardTaskConfig {
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
}

type StudySetup = ArtboardTaskConfig[];