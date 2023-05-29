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
				setAuditlog(auditlog => [operationLog, ...auditlog]);
			},
		});

		return () => disposer.unsubscribe();
	}, []);

	/* #region creating table elements jsx */
	const item = auditlog.length ? auditlog[0] : {};
	const ths = Object.keys(item).map(key => <th key={key}>{key}</th>);
	const trs = auditlog.map(operationLog => {
		const tds = Object.values(operationLog).map(value => {
			if (typeof value === 'object') {
				const json = JSON.stringify(value);
				return <td key={json}>{json}</td>;
			}
			return <td key={value}>{value}</td>;
		});
		return <tr key={operationLog.timestamp.toString()}>{tds}</tr>;
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
