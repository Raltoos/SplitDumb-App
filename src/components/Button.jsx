/* eslint-disable react/prop-types */
export default function Button({type, addStyle="", children, ...props}){
    let classes = "hover:shadow-md border border-black p-2 rounded-lg shadow-sm hover:scale-105 ";
    classes += addStyle;

    return <button className={classes} type={type} {...props}>
        {children}
    </button>;
}