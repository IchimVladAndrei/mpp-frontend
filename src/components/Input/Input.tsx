import React from 'react';
import InputContainer from '../InputContainer/InputContainer';

function Input(
    {label, type, defaultValue, onChange, onBlur, name, error},
    ref,
) {
    const getErrorMessage = () => {
        if (!error) return;
        if (error.message) return error.message;

        switch (error.type) {
            case 'required':
                return 'This Field Is Required';
            case 'minLength':
                return 'Field Is Too Short';
            default:
                return '*';
        }
    };

    return (
        <InputContainer>
            <input
                defaultValue={defaultValue}
                type={type}
                placeholder={label}
                ref={ref}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
            />
            {error && <div className='ErroMSG'>{getErrorMessage()}</div>}
        </InputContainer>
    );
}

export default React.forwardRef(Input);
