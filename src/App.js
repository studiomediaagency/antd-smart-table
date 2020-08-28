import React, {useState} from "react";
import {Button, Input, Table, DatePicker} from "antd";
import {FilterFilled, SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import moment from "moment";

export default function SmartTable(props) {
	const [state, setState] = useState({
		searchedText: "",
		searchedColumn: null,
	});

	const getSearchColumnProps = (dataIndex, dateRange) => ({
		filterDropdown: ({
			                 setSelectedKeys,
			                 selectedKeys,
			                 confirm,
			                 clearFilters,
		                 }) => (
			<div style={{padding: 8}}>
				{dateRange ? (
					<>
						<DatePicker.RangePicker
							style={{width: 300, marginBottom: 8}}
							onChange={e => setSelectedKeys([e[0] + "/" + e[1]])}
							onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
							ranges={{
								"All Time": [moment("2020-03-01").startOf("day"), moment()],
								"Last 7 Days": [
									moment()
										.subtract(7, "days")
										.startOf("day"),
									moment(),
								],
								"Last 30 Days": [
									moment()
										.subtract(30, "days")
										.startOf("day"),
									moment(),
								],
							}}
						/>
						<br/>
					</>
				) : (
					<Input
						placeholder={`Search ${dataIndex}`}
						value={selectedKeys[0]}
						onChange={e => setSelectedKeys(e.currentTarget.value ? [e.currentTarget.value] : [])}
						onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
						style={{width: 188, marginBottom: 8, display: "block"}}
					/>
				)}
				<Button
					type="primary"
					onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
					icon={dateRange ? <FilterFilled/> : <SearchOutlined/>}
					size="small"
					style={{width: 90, marginRight: 8}}>
					{dateRange ? "Filter" : "Search"}
				</Button>
				<Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
					Reset
				</Button>
			</div>
		),
		filterIcon: (filtered) => {
			if (dateRange) {
				return <FilterFilled style={{color: filtered ? "#1890ff" : undefined}}/>;
			} else {
				return <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>;
			}
		},
		onFilter: (value, record) => {
			const date1 = moment(value.split("/")?.[0], "x");
			const date2 = moment(value.split("/")?.[1], "x");

			if (date1.isValid() && date2.isValid()) {
				return moment(record[dataIndex]).isBetween(date1.startOf("day"), date2.endOf("day"));
			} else {
				return record[dataIndex]
					?.toString()
					.toLowerCase()
					.includes(value.toLowerCase());
			}
		},
		render: (text) => {
			if (state.searchedColumn === dataIndex) {
				return (
					<Highlighter
						highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
						searchWords={[state.searchedText]}
						autoEscape
						textToHighlight={text.toString()}
					/>
				);
			} else {
				return text;
			}
		},
	});

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setState({
			searchedText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setState({searchedText: ""});
	};

	return (
		<Table
			{...props}
			columns={props.columns.map(c => {
				if (c.search) {
					return {
						key: c.search,
						...getSearchColumnProps(c.search),
						...c,
					};
				} else if (c.dateRange) {
					return {
						...getSearchColumnProps(c.dataIndex, true),
						...c,
					};
				} else {
					return c;
				}
			})}
		/>
	);
}

