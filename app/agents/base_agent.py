from abc import ABC, abstractmethod
from typing import Any


class BaseAgent(ABC):
    """
    Abstract base class for all autonomous agents
    """

    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    async def run(self) -> Any:
        """
        Main execution method for the agent
        """
        pass

    @abstractmethod
    def get_schedule(self) -> dict:
        """
        Returns APScheduler-compatible schedule config
        """
        pass
