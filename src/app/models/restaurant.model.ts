export class Restaurant {

    constructor(
        public uid: string,
        public cover: string,
        public name: string,
        public short_name: string,
        public cuisines: string[],
        public rating: number,
        public delivery_time: number,
        public price: number,
        public address?: string,
        public distance?: number
    ) {}
}