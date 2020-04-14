export class User {
    public id: number;
    public username: string;
    public name: string;
    public email: string;
    public city: string;
    public rideInGroup: string;
    public dayOfWeek: string;
    public posts: number;
    public albums: number;
    public photos: number;
    constructor(id:number,username:string,name:string,email:string,city:string,rideInGroup:string,dayOfWeek:string,posts:number,albums:number,photos:number) { 
        this.id = id; 
        this.username = username;
        this.name = name;
        this.email = email;
        this.city = city;
        this.rideInGroup = rideInGroup;
        this.dayOfWeek = dayOfWeek;
        this.posts = posts;
        this.albums = albums;
        this.photos = photos; 
    }
}