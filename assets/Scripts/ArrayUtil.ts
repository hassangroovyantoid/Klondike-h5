export namespace ArrayUtil {
    /**
     * Shuffle items in place.
     * https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
     */
    export function shuffle(array: any[]): any[] {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  }