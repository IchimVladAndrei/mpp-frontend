import {JSX} from 'react';
import {Detector} from 'react-detect-offline';
const netDetector = (props: {children: JSX.Element | null}) => {
    return (
        <Detector
            render={({online}) => (
                <div>
                    {!online && (
                        <>
                            <h1>No Connection</h1>
                            <h4>Please check your internet connection</h4>
                        </>
                    )}
                    {props.children}
                </div>
            )}
        />
    );
};
export default netDetector;
