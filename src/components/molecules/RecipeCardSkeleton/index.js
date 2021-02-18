import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

const RecipeCardSkeleton = () => {
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Skeleton variant="rect" height={200}/>
            <Skeleton variant="text" height={70} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} width={200} />
            <div style={{
                display: 'flex',
                marginBottom: '40px',
                marginTop: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Skeleton variant="circle" width={40} height={40} />
                    <Skeleton variant="text" height={20} width={80} />
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: '30px'
                }}>
                    <Skeleton variant="circle" width={40} height={40} />
                    <Skeleton variant="text" height={20} width={80} />
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0px 0px 0px auto'
                }}>
                    <Skeleton variant="circle" width={40} height={40} />
                    <Skeleton variant="text" height={20} width={80} />
                </div>
            </div>
        </div>
    )
}

export default RecipeCardSkeleton
