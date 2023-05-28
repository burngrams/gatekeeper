import React, { useEffect, useState } from 'react';
import { AuditlogModel } from '../lib/models';
import { trpc, wsClient } from './trpc';

/**
 * takes an auditlog and returns a table JSX element
 * it takes each property of the auditlog and creates a th row
 * then it takes each operationlog and creates a tr row with td for each property
 *
 */
export function AuditlogTable() {
	const [auditlogRaw, setAuditlog] = useState<AuditlogModel>([]);
	const auditlog = auditlogRaw.reverse();

	useEffect(() => {
		const getAuditlog = async () => {
			const { auditlog } = await trpc.auditlog.get.query();
			setAuditlog(auditlog);
		};
		getAuditlog();
	}, []);

	useEffect(() => {
		const disposer = wsClient.auditlog.onAdd.subscribe(undefined, {
			onData(operationLog) {
				setAuditlog(auditlog => [...auditlog, operationLog]);
			},
		});

		return () => disposer.unsubscribe();
	}, []);

	/* #region creating table elements jsx */
	const item = auditlog.length ? auditlog[0] : {};
	const ths = Object.keys(item).map(key => <th>{key}</th>);
	const trs = auditlog.map(operationLog => {
		const tds = Object.values(operationLog).map(value => {
			if (typeof value === 'object') {
				return <td>{JSON.stringify(value)}</td>;
			}
			return <td>{value}</td>;
		});
		return <tr>{tds}</tr>;
	});
	/* #endregion */
	return <table>
		<thead>
			<tr>{ths}</tr>
		</thead>
		<tbody>
			{trs}
		</tbody>
	</table>;
}
