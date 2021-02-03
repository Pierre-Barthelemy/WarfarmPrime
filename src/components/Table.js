import React, {useEffect, useState} from 'react';
import BaseTable, { AutoResizer, SortOrder, Column } from 'react-base-table'
import Grid from '@material-ui/core/Grid';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import 'react-base-table/styles.css'


const ColumnMissions = [
    { width:100, key:"name", dataKey:"name", title:'Name', resizable: true, sortable:true, flexGrow: 1,
        align: Column.Alignment.CENTER
    },
    { width:100, key:"type", dataKey:"type", title:'type',  resizable:true, sortable:true, flexGrow: 1,
        align: Column.Alignment.CENTER
    },
    { width:100, key:"lootTable", dataKey:"lootTable", title:'Loot Table', resizable:true, flexGrow: 4,
        align: Column.Alignment.CENTER,
        cellRenderer: ({ cellData: lootTable }) => <ul>
            {lootTable.map((loot) => <li>{loot}</li>)}
        </ul>,
    },
    { width:100, key:"score", dataKey:"score", title:'Score', resizable:true,  sortable:true, flexGrow: 1,
        align: Column.Alignment.CENTER
    },
]

const ColumnRelics = [
    { width:100, key:"name", dataKey:"name", title:'Name', resizable: true, sortable:true, flexGrow: 1,
        align: Column.Alignment.CENTER },
    { width:100, key:"lootTable", dataKey:"lootTable", title:'Loot Table', resizable: true, sortable:false, flexGrow: 4,
        align: Column.Alignment.CENTER
    },
    { width:100, key:"available", dataKey:"available", title:'available', resizable: true, sortable:true, flexGrow: 1,
        align: Column.Alignment.CENTER
    },
]

function Empty() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            fontSize: '16px',
        }}>
            Table is empty
        </div>
    )
}

const defaultSort = { key: 'score', order: SortOrder.DESC }

export default function Table({apiData, selectedPrime, allRelic}) {

    const [relicsRows, setRelicsRows] = useState([])
    const [missionRows, setMissionRows] = useState([])
    const [relicSort, setRelicSort] = useState(defaultSort)
    const [missionSort, setMissionSort] = useState(defaultSort)

    const sortRelic = () => {
        switch (relicSort.key) {
            case 'name':
                if (relicSort.key === 'name') {
                    if (relicSort.order === SortOrder.ASC) {
                        setRelicsRows(relicsRows.sort((a, b) => (a.name > b.name) ? 1 : -1))
                    } else {
                        setRelicsRows(relicsRows.sort((a, b) => (a.name < b.name) ? 1 : -1))
                    }
                }
                break
            case 'available':
                if (relicSort.key === 'available') {
                    if (relicSort.order === SortOrder.ASC) {
                        setRelicsRows(relicsRows.sort((a, b) => (a.vaulted && !b.vaulted) ? -1 : 1))
                    } else {
                        setRelicsRows(relicsRows.sort((a, b) => (a.vaulted && !b.vaulted) ? 1 : -1))
                    }
                }
                break
            default:
                setRelicsRows(relicsRows.sort((a, b) => (a.name > b.name) ? 1 : -1))
        }
    }

    const sortMission = () => {
        switch (relicSort.key) {
            case 'score':
                if (missionSort.order === SortOrder.ASC) {
                    setMissionRows(missionRows.sort((a, b) => (a.score > b.score) ? 1 : -1))
                } else {
                    setMissionRows(missionRows.sort((a, b) => (a.score < b.score) ? 1 : -1))
                }
                break
            case 'name':
                if (missionSort.order === SortOrder.ASC) {
                    setMissionRows(missionRows.sort((a, b) => (a.name > b.name) ? 1 : -1))
                } else {
                    setMissionRows(missionRows.sort((a, b) => (a.name < b.name) ? 1 : -1))
                }
                break
            case 'type':
                if (missionSort.order === SortOrder.ASC) {
                    setMissionRows(missionRows.sort((a, b) => (a.type > b.type) ? 1 : -1))
                } else {
                    setMissionRows(missionRows.sort((a, b) => (a.type < b.type) ? 1 : -1))
                }
                break
            default:
                setMissionRows(missionRows.sort((a, b) => (a.score > b.score) ? 1 : -1))
        }
    }

    const onColumnSortRelic = sortBy => {
        setRelicSort(sortBy)
        sortRelic(sortBy)
    }

    const onColumnSortMission = sortBy => {
        setMissionSort(sortBy)
        sortMission(sortBy)
    }

    useEffect(() => {
        if (selectedPrime !== undefined) {
            let tempList = []
            apiData.Relics.filter(relic => allRelic ? true : relic.Vaulted === allRelic).forEach(relic => {
                let tempLootTable = ''
                if (relic.Common.includes(selectedPrime)) {
                    tempLootTable += 'Common '
                }
                if (relic.Uncommon.includes(selectedPrime)) {
                    tempLootTable += 'Uncommon '
                }
                if (relic.Rare.includes(selectedPrime)) {
                    tempLootTable += 'Rare'
                }
                if (tempLootTable !== '') {
                    tempList.push({
                        name: relic.Name,
                        lootTable: tempLootTable,
                        available: relic.Vaulted ? <CloseIcon /> : <CheckIcon />,
                        vaulted: relic.Vaulted,
                        id: relic.Name
                    })
                }
            })
            if (allRelic) {
                setRelicsRows(tempList.sort((a, b) => (a.vaulted && !b.vaulted) ? 1 : -1))

            } else {
                setRelicsRows(tempList.sort((a, b) => (a.name > b.name) ? 1 : -1))
            }
        } else {
            setRelicsRows([])
            setMissionRows([])
        }
    }, [selectedPrime, apiData, allRelic])

    const rowEventHandlers = {
        onClick: ({ rowData, rowIndex, rowKey, event }) => {
            let tempList = []
            apiData.Missions.forEach(mission => {
                let tempScore = 0
                let tempLootTable = []
                let findRelic = mission.RotationA.find( loot => loot.loot === rowData.name);
                if (findRelic !== undefined) {
                    tempScore += findRelic.luck * mission.Type.A * mission.Type.Main
                    tempLootTable.push('Rotation A ' + (findRelic.luck * 100)  + '%')
                }
                findRelic = mission.RotationB.find( loot => loot.loot === rowData.name );
                if (findRelic !== undefined) {
                    tempScore += findRelic.luck * mission.Type.B * mission.Type.Main
                    tempLootTable.push('Rotation B ' + (findRelic.luck * 100)  + '%')
                }
                findRelic = mission.RotationC.find( loot => loot.loot === rowData.name );
                if (findRelic !== undefined) {
                    tempScore += findRelic.luck * mission.Type.C * mission.Type.Main
                    tempLootTable.push('Rotation C ' + (findRelic.luck * 100)  + '%')
		}
                if (tempScore !== 0) {
                    tempList.push({
                        name: mission.Name,
                        lootTable: tempLootTable,
                        type: mission.Type.Name,
                        score: Math.round(tempScore * 100) / 100,
                        id: mission.Name + tempScore
                    })
                }
            })
            setMissionRows(tempList.sort((a, b) => (a.score < b.score) ? 1 : -1))
        },
    }

    return (
        <Grid
            style={{height: '100%'}}
            container
            spacing={2}
            justify="center"
        >
            <Grid
                item
                md={6}
                xs={12}
                key='relic'
            >
                <AutoResizer >
                    {({ width, height }) => (
                        <BaseTable
                            width={width}
                            height={height}
                            columns={ColumnRelics}
                            emptyRenderer={<Empty />}
                            sortBy={relicSort}
                            onColumnSort={onColumnSortRelic}
                            data={relicsRows}
                            rowEventHandlers={rowEventHandlers}
                        />
                    )}
                </AutoResizer>
            </Grid>
            <Grid
                item
                md={6}
                xs={12}
                key='mission'
            >
                <AutoResizer >
                        {({ width, height }) => (
                            <BaseTable
                                width={width}
                                height={height}
                                sortBy={missionSort}
                                columns={ColumnMissions}
                                onColumnSort={onColumnSortMission}
                                emptyRenderer={<Empty />}
                                data={missionRows}
                            />
                        )}
                </AutoResizer>
            </Grid>
        </Grid>
    )
}
