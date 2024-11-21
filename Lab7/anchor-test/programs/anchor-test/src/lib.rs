use anchor_lang::prelude::*;

declare_id!("78Rps16Cc2AKjtGiferUqMaqrPapokmftWRccHQozY9Q");

#[program]
pub mod anchor_test {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
