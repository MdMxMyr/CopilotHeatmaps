import { ArtboardDimensions, StudySetup } from "@/config/ArtboardConfig";

// Study artboard dimensions
export const studyArtboardDimensions: ArtboardDimensions = {
    width: 1615,
    height: 896,
}

// Study setup for the study
export const studySetup: StudySetup = [
    {
        artboardTitle: 'Calibration - Top Left',
        initialMessage: 'Click on the marker at the top left corner as shown in the image',
        confirmationMessage: 'Click on the "Proceed" button to continue',
        measurementType: 'topLeftCalibration',
        isStudyTask: true,
    },
    {
        artboardTitle: 'Calibration - Bottom Right',
        initialMessage: 'Click on the marker at the bottom right corner as shown in the image',
        confirmationMessage: 'Click on the "Proceed" button to continue',
        measurementType: 'bottomRightCalibration',
        isStudyTask: true,
    },
    {
        artboardTitle: 'Instruction Screen',
        initialMessage: '',
        confirmationMessage: '',
        measurementType: 'none',
        isStudyTask: false,
    },
    {
        artboardTitle: 'Task 1',
        initialMessage: 'Where would you click to ask Copilot to transform this presentation into a Word document?',
        confirmationMessage: 'Where would you click to ask Copilot to transform this presentation into a Word document?',
        measurementType: 'cursorMovement',
        isStudyTask: true,
    },
    {
        artboardTitle: 'Task 2',
        initialMessage: 'Where would you click if you wanted Copilot to translate this document in Spanish?',
        confirmationMessage: 'Where would you click if you wanted Copilot to translate this document in Spanish?',
        measurementType: 'cursorMovement',
        isStudyTask: true,
    },
    {
        artboardTitle: 'End of Task',
        initialMessage: 'Task completed',
        confirmationMessage: 'Task completed',
        measurementType: 'taskComplete',
        isStudyTask: false,
    }
]