import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';

export const ToBoolean = () => {
    const toPlain = Transform(
        ({ value }) => {
            return value;
        },
        {
            toPlainOnly: true,
        },
    );
    const toClass = (target: any, key: string) => {
        return Transform(
            ({ obj }) => {
                try {
                    return valueToBoolean(obj[key]);
                } catch (error: any) {
                    throw new BadRequestException(`${key} must be a boolean. ${error.message}`);
                }
            },
            {
                toClassOnly: true,
            },
        )(target, key);
    };
    return (target: any, key: string) => {
        toPlain(target, key);
        toClass(target, key);
    };
};

const valueToBoolean = (value: any) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') {
            return true;
        }
        if (value.toLowerCase() === 'false') {
            return false;
        }
    }

    throw new BadRequestException(`Invalid boolean value: ${value}`);
};
