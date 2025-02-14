import { ClickData, CursorData } from '@/app/api/data/dataTypes';

/**
 * @description Options for the submitData function
 * @param type - The type of data to submit
 * @param payload - The data to submit
 */
interface SubmitDataOptions {
  type: 'cursor' | 'click';
  payload: ClickData | CursorData;
}

/**
 * @description Hook to submit data to the database
 * @returns {Object} - An object containing the submitData function
 */
export const useSubmitData = () => {
  const submitData = async ({ type, payload }: SubmitDataOptions) => {
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, payload }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting data:', error);
      throw error;
    }
  };

  return { submitData };
};