import {users} from "../../repository/storage";
import bcrypt from "bcrypt";
import {IUser} from "../../models/models";
import {ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD} from "../../constants";

const adminExists: IUser | undefined = users.find((user: IUser):boolean => user.email === ADMIN_EMAIL);
if (!adminExists) {
    const adminName: string = ADMIN_NAME;
    const adminEmail: string = ADMIN_EMAIL;
    const adminPassword: string = ADMIN_PASSWORD;

    if (adminName && adminEmail && adminPassword) {
        bcrypt.hash(adminPassword, 12).then((hashedPassword: string): void => {
            const admin: IUser = {
                name: adminName,
                email: adminEmail,
                password: hashedPassword,
                role: "ADMIN"
            }
            users.push(admin);
            console.log('Admin created');
        });
    } else {
        console.error('Error creating admin')
    }
} else {
    console.log('Admin user already exists');
}