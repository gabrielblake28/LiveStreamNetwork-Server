export class Helpers {
    static formatStringFromArray(arr: string[] | number[] | boolean[]): string {
        let value = "";

        arr.map((element, index) => {
            value += `${element}${index != arr.length - 1 ? "," : ""}`;
        });

        return value;
    }
}
