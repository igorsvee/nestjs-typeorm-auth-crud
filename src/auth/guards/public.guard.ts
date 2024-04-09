import { SetMetadata } from "@nestjs/common";
//  can be placed on a route to make it public, i.e. accessible by anyone
export const Public = () => SetMetadata("isPublic", true);
