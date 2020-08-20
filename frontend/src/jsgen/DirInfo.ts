/* tslint:disable */
/* eslint-disable */
/*
 * Autogenerated by @creditkarma/thrift-typescript v3.7.6
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
*/
import * as thrift from "thrift";
import * as Item from "./Item";
export interface IDirInfoArgs {
    contents: Array<Item.Item>;
    thumbnail_absolute_path?: string;
    theme_color?: string;
}
export class DirInfo {
    public contents: Array<Item.Item>;
    public thumbnail_absolute_path?: string;
    public theme_color?: string;
    constructor(args: IDirInfoArgs) {
        if (args != null && args.contents != null) {
            this.contents = args.contents;
        }
        else {
            throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, "Required field[contents] is unset!");
        }
        if (args != null && args.thumbnail_absolute_path != null) {
            this.thumbnail_absolute_path = args.thumbnail_absolute_path;
        }
        if (args != null && args.theme_color != null) {
            this.theme_color = args.theme_color;
        }
    }
    public write(output: thrift.TProtocol): void {
        output.writeStructBegin("DirInfo");
        if (this.contents != null) {
            output.writeFieldBegin("contents", thrift.Thrift.Type.LIST, 1);
            output.writeListBegin(thrift.Thrift.Type.STRUCT, this.contents.length);
            this.contents.forEach((value_1: Item.Item): void => {
                value_1.write(output);
            });
            output.writeListEnd();
            output.writeFieldEnd();
        }
        if (this.thumbnail_absolute_path != null) {
            output.writeFieldBegin("thumbnail_absolute_path", thrift.Thrift.Type.STRING, 2);
            output.writeString(this.thumbnail_absolute_path);
            output.writeFieldEnd();
        }
        if (this.theme_color != null) {
            output.writeFieldBegin("theme_color", thrift.Thrift.Type.STRING, 3);
            output.writeString(this.theme_color);
            output.writeFieldEnd();
        }
        output.writeFieldStop();
        output.writeStructEnd();
        return;
    }
    public static read(input: thrift.TProtocol): DirInfo {
        input.readStructBegin();
        let _args: any = {};
        while (true) {
            const ret: thrift.TField = input.readFieldBegin();
            const fieldType: thrift.Thrift.Type = ret.ftype;
            const fieldId: number = ret.fid;
            if (fieldType === thrift.Thrift.Type.STOP) {
                break;
            }
            switch (fieldId) {
                case 1:
                    if (fieldType === thrift.Thrift.Type.LIST) {
                        const value_2: Array<Item.Item> = new Array<Item.Item>();
                        const metadata_1: thrift.TList = input.readListBegin();
                        const size_1: number = metadata_1.size;
                        for (let i_1: number = 0; i_1 < size_1; i_1++) {
                            const value_3: Item.Item = Item.Item.read(input);
                            value_2.push(value_3);
                        }
                        input.readListEnd();
                        _args.contents = value_2;
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                case 2:
                    if (fieldType === thrift.Thrift.Type.STRING) {
                        const value_4: string = input.readString();
                        _args.thumbnail_absolute_path = value_4;
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                case 3:
                    if (fieldType === thrift.Thrift.Type.STRING) {
                        const value_5: string = input.readString();
                        _args.theme_color = value_5;
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                default: {
                    input.skip(fieldType);
                }
            }
            input.readFieldEnd();
        }
        input.readStructEnd();
        if (_args.contents !== undefined) {
            return new DirInfo(_args);
        }
        else {
            throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, "Unable to read DirInfo from input");
        }
    }
}
