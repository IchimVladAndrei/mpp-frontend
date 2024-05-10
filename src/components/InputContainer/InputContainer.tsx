export default function InputContainer({label, bgColor, children}) {
    return (
        <div style={{backgroundColor: bgColor}}>
            <label>{label}</label>
            <div>{children}</div>
        </div>
    );
}
