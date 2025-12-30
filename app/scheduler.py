from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.agents.reminder_agent import ReminderAgent
import logging

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()
reminder_agent = ReminderAgent()

async def run_reminder_agent_job():
    logger.info("Running scheduled Reminder Agent...")
    await reminder_agent.run()

def start_scheduler():
    # Schedule Reminder Agent to run every hour
    scheduler.add_job(run_reminder_agent_job, 'interval', hours=1)
    
    # You could also schedule ETL here if needed
    # scheduler.add_job(etl_service.run_pipeline, 'cron', hour=0) # Run at midnight
    
    scheduler.start()
    logger.info("Scheduler started.")
