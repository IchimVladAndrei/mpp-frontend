import {JSX} from 'react';
import {Detector} from 'react-detect-offline';
const netDetector = (props: {children: JSX.Element | null}) => {
    return (
        <>
            <Detector
                render={({online}) =>
                    online ? (
                        props.children
                    ) : (
                        <div>
                            <h1>No Connection</h1>
                            <h4>Please check your internet connection</h4>
                        </div>
                    )
                }
            ></Detector>
        </>
    );
};
export default netDetector;
