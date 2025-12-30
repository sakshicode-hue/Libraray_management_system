from datetime import datetime, timedelta
from typing import List

from app.agents.base_agent import BaseAgent
from app.cores.database import transactions_collection
from app.utils.ai_helper import generate_reminder_message
from app.utils.utils import send_notification


class ReminderAgent(BaseAgent):
    """
    Autonomous agent responsible for sending
    due-date and fine reminders
    """

    def __init__(self):
        super().__init__(name="ReminderAgent")
        self.db = transactions_collection # Use specific collection or just keep usage consistent

    async def run(self):
        """
        Entry point executed by APScheduler
        """
        due_soon = await self._get_due_soon_transactions()
        overdue = await self._get_overdue_transactions()

        for txn in due_soon + overdue:
            message = generate_reminder_message(txn)
            await send_notification(
                user_id=txn["member_id"], # Changed from user_id to member_id to match DB schema
                message=message
            )

    async def _get_due_soon_transactions(self) -> List[dict]:
        """
        Fetch transactions with due date in next N days
        """
        today = datetime.utcnow()
        due_limit = today + timedelta(days=2)

        cursor = transactions_collection.find({
            "due_date": {"$gte": today, "$lte": due_limit},
            "status": "borrowed"  # Changed from returned: False to match schema
        })

        return await cursor.to_list(length=100)

    async def _get_overdue_transactions(self) -> List[dict]:
        """
        Fetch overdue transactions
        """
        today = datetime.utcnow()

        cursor = transactions_collection.find({
            "due_date": {"$lt": today},
            "status": "borrowed"
        })

        return await cursor.to_list(length=100)

    def get_schedule(self) -> dict:
        """
        APScheduler schedule configuration
        """
        return {
            "trigger": "cron",
            "hour": 9,
            "minute": 0
        }
