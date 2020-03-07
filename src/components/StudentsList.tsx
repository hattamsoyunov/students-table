import React from 'react';
import { useSelector } from 'react-redux';

import { IStudent, IStudentsState, Order, Data } from '../interfaces';

import StudentItem from './StudentItem';

// Sort functions (thanks Mui)
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
	const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}

// Component
interface Props {
	order: Order;
	orderBy: keyof Data;
}

const StudentsList: React.FC<Props> = props => {
	const students = useSelector((state: IStudentsState) => state.students);

	return (
		<>
			{stableSort(students, getComparator(props.order, props.orderBy)).map((student: IStudent) => (
				<StudentItem key={student.id} student={student} />
			))}
		</>
	);
};

export default StudentsList;
